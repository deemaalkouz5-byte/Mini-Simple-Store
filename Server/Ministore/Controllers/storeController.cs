using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ministore.Data;
using Ministore.DTOs;
using Ministore.Model;

namespace Ministore.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly MinistoreDbContext _context;

    public OrdersController(MinistoreDbContext context)
    {
        _context = context;
    }

    // 1. جلب كافة الطلبات (GET All)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.OrderDate)
            .ToListAsync();

        var response = orders.Select(order => new OrderResponseDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            Phone = order.Phone,
            Address = order.Address,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.Product?.Name ?? string.Empty,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        }).ToList();

        return Ok(response);
    }

    // 2. جلب طلب واحد برقم المعرف (GET by ID)
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound($"Order with ID {id} was not found.");

        var responseItems = order.OrderItems.Select(oi => new OrderItemResponseDto
        {
            ProductId = oi.ProductId,
            ProductName = oi.Product?.Name ?? string.Empty,
            Quantity = oi.Quantity,
            Price = oi.Price
        }).ToList();

        return Ok(new OrderResponseDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            Phone = order.Phone,
            Address = order.Address,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            OrderItems = responseItems
        });
    }

    // 3. إنشاء طلب جديد (POST)
    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder(CreateOrderDto dto)
    {
        if (dto.OrderItems == null || !dto.OrderItems.Any())
        {
            return BadRequest("Cannot place an empty order.");
        }

        var productIds = dto.OrderItems.Select(i => i.ProductId).ToList();

        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        foreach (var item in dto.OrderItems)
        {
            if (!products.ContainsKey(item.ProductId))
            {
                return BadRequest($"Product with ID {item.ProductId} was not found.");
            }
        }

        decimal totalAmount = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in dto.OrderItems)
        {
            var product = products[item.ProductId];
            var itemPrice = product.Price;
            totalAmount += itemPrice * item.Quantity;

            orderItems.Add(new OrderItem
            {
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                Price = itemPrice
            });
        }

        var order = new Order
        {
            CustomerName = dto.CustomerName,
            Phone = dto.Phone,
            Address = dto.Address,
            OrderDate = DateTime.UtcNow,
            TotalAmount = totalAmount,
            OrderItems = orderItems
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var responseItems = order.OrderItems.Select(oi => new OrderItemResponseDto
        {
            ProductId = oi.ProductId,
            ProductName = products[oi.ProductId].Name,
            Quantity = oi.Quantity,
            Price = oi.Price
        }).ToList();

        var response = new OrderResponseDto
        {
            Id = order.Id,
            CustomerName = order.CustomerName,
            Phone = order.Phone,
            Address = order.Address,
            OrderDate = order.OrderDate,
            TotalAmount = order.TotalAmount,
            OrderItems = responseItems
        };

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, response);
    }

    // 4. حذف طلب بالكامل (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound($"Order with ID {id} was not found.");
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content
    }

    // 5. حذف عنصر واحد محدد من داخل الطلب بإعادة حساب الإجمالي تلقائياً (DELETE Item from Order)
    [HttpDelete("{orderId}/items/{productId}")]
    public async Task<IActionResult> DeleteOrderItem(int orderId, int productId)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null)
        {
            return NotFound($"Order with ID {orderId} was not found.");
        }

        var itemToRemove = order.OrderItems.FirstOrDefault(oi => oi.ProductId == productId);
        if (itemToRemove == null)
        {
            return NotFound($"Product with ID {productId} is not part of Order {orderId}.");
        }

        // خصم قيمة العنصر المحذوف من المبلغ الإجمالي
        order.TotalAmount -= itemToRemove.Price * itemToRemove.Quantity;
        order.OrderItems.Remove(itemToRemove);

        // إذا أصبح الطلب فارغاً يمكن حذفه تلقائياً أو إبقائه بقيمة 0
        if (!order.OrderItems.Any())
        {
            _context.Orders.Remove(order);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}