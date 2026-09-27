using Microsoft.EntityFrameworkCore;
using Ministore.Model;

namespace Ministore.Data;

public class MinistoreDbContext : DbContext
{
    public MinistoreDbContext(DbContextOptions<MinistoreDbContext> options) : base(options)
    {
    }

    public DbSet<Order> Orders { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // 1. تحديد الدقة الحسابية للحقول المالية
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Order>()
            .Property(o => o.TotalAmount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(oi => oi.Price)
            .HasPrecision(18, 2);

        // 2. إضافة المنتجات التجريبية (Data Seeding)
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Wireless Mouse", Description = "Ergonomic wireless mouse", Price = 25.00m, ImageUrl = "https://via.placeholder.com/150" },
            new Product { Id = 2, Name = "Mechanical Keyboard", Description = "RGB Mechanical Keyboard", Price = 75.50m, ImageUrl = "https://via.placeholder.com/150" },
            new Product { Id = 3, Name = "Gaming Headset", Description = "7.1 Surround Sound Headset", Price = 50.00m, ImageUrl = "https://via.placeholder.com/150" }
        );
    }
}