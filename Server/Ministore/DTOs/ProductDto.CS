
namespace Ministore.DTOs;
using System.ComponentModel.DataAnnotations;


public class ProductResponseDto
{

 
     public int Id{get; set;}
     public string Name{get; set;}= string.Empty;
     public string Description{get; set;}= string.Empty;
     public decimal Price{get; set;}
     public string ImageUrl{get; set;}= string.Empty;
}
public class CreateProductDto
{
     [Required(ErrorMessage = "Product name is required.")]
     public string Name{get; set;}= string.Empty;
     [Required(ErrorMessage = "Description is required.")]
     public string Description{get; set;}= string.Empty;
     [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
     public decimal Price{get; set;}
     public string ImageUrl{get; set;}= string.Empty;
}


    
