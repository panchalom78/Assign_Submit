using CG.Web.MegaApiClient;

namespace Server.Helper;
public static class Upload{
    public static void UploadAssignment(){
        var client = new MegaApiClient();
        client.Login("panchalom787@gmail.com","Ompan@78");

        var nodes = client.GetNodes();

        // Find the specific file node you want to download by its name
        var fileNode = nodes.FirstOrDefault(n => n.Type == NodeType.File && n.Name == "rc.pdf");

        if (fileNode != null)
        {
            // Specify the local path where the file will be saved
            string localPath = Path.Combine(@"C:\Files", fileNode.Name);

            // Download the file
            using (var stream = client.Download(fileNode))
            {
                using (var fileStream = new FileStream(localPath, FileMode.Create, FileAccess.Write))
                {
                    stream.CopyTo(fileStream);
                }
            }

            Console.WriteLine($"File '{fileNode.Name}' downloaded successfully to '{localPath}'.");
        }
        else
        {
            Console.WriteLine("File not found in your MEGA account.");
        }

        // Log out
        client.Logout();
    }
}