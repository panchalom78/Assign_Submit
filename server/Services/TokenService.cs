using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Server.Token;
public class TokenService
{
    public static TokenInfo DecodeToken(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            if (jsonToken == null) return null;

            return new TokenInfo
            {
                UserId = int.Parse(jsonToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value ?? "0"),
                Role = jsonToken.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role)?.Value
            };
        }
        catch (Exception ex)
        {
            throw new Exception("Failed to create assignment: " + ex.Message);
        }
    }
}

// Class to hold token information
public class TokenInfo
{
    public int UserId { get; set; }
    public string Role { get; set; }
    public DateTime ExpirationTime { get; set; }
    public DateTime IssuedTime { get; set; }
}