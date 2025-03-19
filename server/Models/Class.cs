namespace Server.Models
{
    public class Class
    {
        public int ClassId { get; set; }
        public string? ClassName { get; set; }
        public int FacultyId { get; set; }
        public Faculty? Faculty { get; set; }
        public ICollection<Assignment>? Assignments { get; set; }
    }
}