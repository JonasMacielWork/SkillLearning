using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SkillLearning.Infrastructure.Persistence
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationWriteDbContext>
    {
        public ApplicationWriteDbContext CreateDbContext(string[] args)
        {
            var basePath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "SkillLearning.Api"));
            var userSecretsId = "d7ed92bc-336a-49c6-b635-7ae0f28a198c";

            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddUserSecrets(userSecretsId)
                .AddEnvironmentVariables()
                .Build();

            var connectionString = config.GetConnectionString("Default") ?? throw new ArgumentException("Connection string 'Default' not found.");
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationWriteDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationWriteDbContext(optionsBuilder.Options);
        }
    }
}