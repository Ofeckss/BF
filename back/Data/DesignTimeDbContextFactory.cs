using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;

namespace back.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var conn = Environment.GetEnvironmentVariable("ConnectionStrings__Default")
                   ?? "Server=127.0.0.1;Database=dev;User=root;Password=;";

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        try
        {
            optionsBuilder.UseMySql(conn, ServerVersion.AutoDetect(conn));
        }
        catch
        {
            // If AutoDetect fails (no DB reachable at design time), fall back to a reasonable server version
            var fallback = ServerVersion.Parse("8.0.32-mysql");
            optionsBuilder.UseMySql(conn, fallback);
        }

        return new AppDbContext(optionsBuilder.Options);
    }
}
