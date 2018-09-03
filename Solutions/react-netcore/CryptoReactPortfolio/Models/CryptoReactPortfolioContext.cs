using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace CryptoReactPortfolio.Models
{
    public class CryptoReactPortfolioContext : DbContext
    {
        public CryptoReactPortfolioContext(DbContextOptions<CryptoReactPortfolioContext> options)
            : base(options)
        {
        }

        public DbSet<Asset> Assets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Asset>().HasData(
                JsonConvert.DeserializeObject<List<Asset>>(System.IO.File.ReadAllText(@"Assets.json")).ToArray()
            );
        }
    }
}