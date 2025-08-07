using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.UserSecrets;
using System.Reflection;

namespace SkillLearning.Infrastructure.Persistence
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationWriteDbContext>
    {
        public ApplicationWriteDbContext CreateDbContext(string[] args)
        {
            var currentDir = Directory.GetCurrentDirectory();
            var projectRoot = Path.GetFullPath(Path.Combine(currentDir, "..", "SkillLearning.Api"));
            var configFile = Path.Combine(projectRoot, "appsettings.json");

            if (!File.Exists(configFile))
                throw new FileNotFoundException("Arquivo appsettings.json não encontrado no path: " + configFile);

            var apiAssembly = Assembly.Load("../SkillLearning.Api");

            var config = new ConfigurationBuilder()
                .SetBasePath(projectRoot)
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddUserSecrets(apiAssembly)
                .Build();

            var connectionString = config.GetConnectionString("Default");

            if (string.IsNullOrWhiteSpace(connectionString) || connectionString == "placeholder")
                throw new ArgumentException("Connection string inválida ou não configurada corretamente.");

            Console.WriteLine($"[DEBUG] Connection string: {connectionString}");

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationWriteDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationWriteDbContext(optionsBuilder.Options);
        }
    }
}