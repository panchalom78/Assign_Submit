# ---- Build Stage ----
    FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
    WORKDIR /src
    
    COPY . .
    RUN dotnet restore
    RUN dotnet publish -c Release -o /app/publish
    
    # ---- Runtime Stage ----
    FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
    WORKDIR /app
    COPY --from=build /app/publish .
    
    # For Render port binding
    ENV ASPNETCORE_URLS=http://+:10000
    EXPOSE 10000
    
    ENTRYPOINT ["dotnet", "server.dll"]
    