namespace Server.Models
{
    public class Course
    {
        public int CourseId { get; set; }
        public string? CourseName { get; set; }
        public int FacultyId { get; set; }
        public Faculty? Faculty { get; set; }
        public ICollection<Class>? Classes { get; set; }
    }
}