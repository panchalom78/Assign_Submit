namespace Server.Models
{
    public class College
    {
        public int CollegeId { get; set; } // Primary Key
        public string? CollegeName { get; set; } = string.Empty;

        // Relationships
        public List<Faculty>? Faculties { get; set; }
        public List<User>? Users { get; set; }
    }
}
