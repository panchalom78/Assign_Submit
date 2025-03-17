using BCrypt.Net;

namespace Server.Helper;

public static class PassHash{
    public static string HashPassword(string password){
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
    public static bool VerifyPassword(string hashedPassword, string password){
        return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
    }
}