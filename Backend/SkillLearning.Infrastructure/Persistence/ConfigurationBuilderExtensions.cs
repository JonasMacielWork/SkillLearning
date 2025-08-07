using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace SkillLearning.Infrastructure.Persistence
{
    public static class ConfigurationBuilderExtensions
    {
        public static IConfigurationBuilder AddUserSecretsFromProjectWithSecrets(this IConfigurationBuilder builder)
        {
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();

            var targetAssembly = assemblies.FirstOrDefault(a =>
                a.GetCustomAttributes(typeof(UserSecretsIdAttribute), false).Any());

            if (targetAssembly != null)
            {
                builder.AddUserSecrets(targetAssembly);
            }

            return builder;
        }
    }
}