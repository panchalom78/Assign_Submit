# --- Build Stage ---
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /src
    
    COPY . .
    RUN dotnet restore
    RUN dotnet publish -c Release -o /app/publish
    
    # --- Runtime Stage ---
    FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
    WORKDIR /app
    COPY --from=build /app/publish .
    
    # Expose the port for Render
    ENV ASPNETCORE_URLS=http://+:10000
    EXPOSE 10000
    
    ENTRYPOINT ["dotnet", "server.dll"]
    