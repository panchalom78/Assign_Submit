using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class User
{
    public int Id { get; set; }
    [Required(ErrorMessage = "Name is required")]
    public required string Name { get; set; }
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public required string Email { get; set; }
    public required string Password { get; set; }

    [Required(ErrorMessage = "Role is required")]
    [RegularExpression("Student|Teacher", ErrorMessage = "Invalid Role")]
    public required string Role { get; set; }
}

public class LoginUser
{
    public string Email { get; set; } = String.Empty;
    public string Password { get; set; } = String.Empty;
}