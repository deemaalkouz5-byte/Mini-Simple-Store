namespace Ministore.Model;

public class Order
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }

    // العلاقة: الطلب الواحد يحتوي على قائمة من عناصر الطلب (OrderItems)
    public List<OrderItem> OrderItems { get; set; } = new();
}