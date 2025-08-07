FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
RUN adduser --system --uid 1000 appuser

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["SkillLearning.sln", "./"]
COPY ["Backend/SkillLearning.Api/SkillLearning.Api.csproj", "Backend/SkillLearning.Api/"]
COPY ["Backend/SkillLearning.Application/SkillLearning.Application.csproj", "Backend/SkillLearning.Application/"]
COPY ["Backend/SkillLearning.Domain/SkillLearning.Domain.csproj", "Backend/SkillLearning.Domain/"]
COPY ["Backend/SkillLearning.Infrastructure/SkillLearning.Infrastructure.csproj", "Backend/SkillLearning.Infrastructure/"]
COPY ["Backend/SkillLearning.Workers.EmailSender/SkillLearning.Workers.EmailSender.csproj", "Backend/SkillLearning.Workers.EmailSender/"]

RUN dotnet restore "SkillLearning.sln"

COPY . .
WORKDIR "/src/Backend/SkillLearning.Api"
RUN dotnet publish "SkillLearning.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish --no-restore /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
USER appuser
ENTRYPOINT ["dotnet", "SkillLearning.Api.dll"]