using System.ComponentModel.DataAnnotations;

namespace Ministore.DTOs;
// 1. DTO لسطر المنتج المطلوب داخل الطلب عند إنشاء الطلب
public class CreateOrderItemDto{
    [Required]
    public int ProductId { get; set; }

    [Required]
    [Range(1, 100, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }
};
// 2. DTO لاستقبال طلب شراء جديد من السلة (Checkout Form)
public class CreateOrderDto{
    [Required(ErrorMessage = "Customer name is required.")]
     public string CustomerName { get; set; }= string.Empty;

    [Required(ErrorMessage = "Phone number is required.")]
    public string Phone { get; set; }= string.Empty;

    [Required(ErrorMessage = "Address is required.")]
    public string Address { get; set; }= string.Empty;
    public decimal Price { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "Order must contain at least one item.")]
    public List<CreateOrderItemDto> OrderItems { get; set; }= new List<CreateOrderItemDto>();
};

// 3. DTO لإرجاع تفاصيل الطلب مع منتجاته للـ Angular
public class OrderResponseDto{
    public int Id { get; set; }
    public string CustomerName { get; set; }= string.Empty;
    public string Phone { get; set; }= string.Empty;
    public string Address { get; set; }= string.Empty;
    public DateTime OrderDate { get; set; }
    public decimal TotalAmount { get; set; }
    public List<OrderItemResponseDto> OrderItems { get; set; }= new List<OrderItemResponseDto>();
};

// 4. DTO لعرض تفاصيل المنتج داخل الطلب للمستخدم
public class OrderItemResponseDto{
    public int ProductId { get; set; }
    public string ProductName { get; set; }= string.Empty;
    public int Quantity { get; set; }
    public decimal Price { get; set; }
};