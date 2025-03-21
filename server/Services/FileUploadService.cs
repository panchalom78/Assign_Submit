using CG.Web.MegaApiClient;
using System;
using System.IO;
using System.Threading.Tasks;
using Server.Services;

public class MegaUploader
{
    /// <summary>
    /// Uploads a PDF file to MEGA asynchronously.
    /// </summary>
    /// <param name="email">MEGA account email</param>
    /// <param name="password">MEGA account password</param>
    /// <param name="filePath">Local path to the PDF file</param>
    /// <param name="targetFolderName">Optional: Name of the target folder (null for root)</param>
    /// <returns>The ID of the uploaded file, or null if upload fails</returns>
    /// <exception cref="ArgumentException">Thrown if filePath is invalid</exception>
    public static async Task<string> UploadPdfToMegaAsync(string email, string password, string filePath, string targetFolderName = null)
    {
        try
        {
            // Validate input
            if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath))
            {
                throw new ArgumentException("Invalid or non-existent file path.");
            }
            if (!filePath.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("File must be a PDF.");
            }

            // Initialize the MEGA client
            var client = new MegaApiClient();
            await client.LoginAsync(email, password);

            // Get nodes and determine target folder
            var nodes = await client.GetNodesAsync();
            INode targetFolder = nodes.Single(n => n.Type == NodeType.Root); // Default to root
            if (!string.IsNullOrEmpty(targetFolderName))
            {
                targetFolder = nodes.FirstOrDefault(n => n.Type == NodeType.Directory && n.Name == targetFolderName);
                if (targetFolder == null)
                {
                    Console.WriteLine($"Folder '{targetFolderName}' not found. Uploading to root instead.");
                    targetFolder = nodes.Single(n => n.Type == NodeType.Root);
                }
            }

            // Upload the file with progress tracking
            var progress = new Progress<double>(percent =>
                Console.WriteLine($"Upload progress: {percent:F2}%"));
            INode uploadedFile = await client.UploadFileAsync(filePath, targetFolder, progress);

            // Log out and return the file ID
            await client.LogoutAsync();
            return uploadedFile.Id;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Upload failed: {ex.Message}");
            return null; // Return null on failure
        }
    }

    public static async Task<bool> DownloadFileFromMegaAsync(string email, string password, string fileId, string destinationPath)
    {
        try
        {
            // Validate input
            if (string.IsNullOrEmpty(fileId))
            {
                throw new ArgumentException("File ID cannot be empty.");
            }
            if (string.IsNullOrEmpty(destinationPath))
            {
                throw new ArgumentException("Destination path cannot be empty.");
            }

            // Ensure the destination directory exists
            string directory = Path.GetDirectoryName(destinationPath);
            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Initialize the MEGA client
            var client = new MegaApiClient();
            await client.LoginAsync(email, password);

            // Get all nodes and find the file by ID
            var nodes = await client.GetNodesAsync();
            INode fileNode = nodes.FirstOrDefault(n => n.Id == fileId && n.Type == NodeType.File);
            if (fileNode == null)
            {
                Console.WriteLine($"File with ID '{fileId}' not found.");
                await client.LogoutAsync();
                return false;
            }

            // Download the file with progress tracking
            var progress = new Progress<double>(percent =>
                Console.WriteLine($"Download progress: {percent:F2}%"));
            await client.DownloadFileAsync(fileNode, destinationPath, progress);

            // Log out
            await client.LogoutAsync();
            Console.WriteLine($"File downloaded successfully to: {destinationPath}");
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Download failed: {ex.Message}");
            return false;
        }
    }
}