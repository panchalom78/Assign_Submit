namespace Server.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public int? FacultyId { get; set; }
        public Faculty? Faculty { get; set; }
        public int? ClassId { get; set; }
        public Class? Class { get; set; }
        public int? CourseId { get; set; }
        public Course? Course { get; set; }
        public int? CollegeId { get; set; } 
        public College? College { get; set; } 
        public List<Submission>? Submissions { get; set; }
    }
}