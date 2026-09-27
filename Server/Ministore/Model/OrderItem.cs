namespace Ministore.Model;

public class OrderItem
{
    public int Id { get; set; }

    // الربط مع جدول Order
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    // الربط مع جدول Product
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public int Quantity { get; set; }
    public decimal Price { get; set; }
}