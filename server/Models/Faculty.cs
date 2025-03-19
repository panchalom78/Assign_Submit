namespace Server.Models
{
    public class Faculty
    {
        public int FacultyId { get; set; }
        public string? FacultyName { get; set; }      // Nullable
        public string? CollegeName { get; set; }      // Nullable, corrected typo
        public ICollection<Class>? Classes { get; set; } // Nullable
        public List<User>? Users { get; set; }        // Add back for consistency
    }
}