namespace Server.Models
{
    public class Class
    {
        public int ClassId { get; set; }
        public string? ClassName { get; set; }
        public int FacultyId { get; set; }
        public Faculty? Faculty { get; set; }
        public int CourseId { get; set; }          // New foreign key
        public Course? Course { get; set; }        // New navigation
        public ICollection<Assignment>? Assignments { get; set; }
    }
}