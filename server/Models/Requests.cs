namespace Server.Models
{
    public class RegisterRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
    }

    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }


    public class SelectAffiliationRequest
    {
        public string Role { get; set; } = string.Empty;
        public int CollegeId { get; set; }
        public int FacultyId { get; set; }
        public int? CourseId { get; set; } // Nullable for Teachers
        public int? ClassId { get; set; } // Nullable for Teachers
        public string? Prn { get; set; }
    }

    public record UserData
    (
         int UserId,
         string? FullName,
         string? Role
    );
}

