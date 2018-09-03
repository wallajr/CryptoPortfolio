using System.ComponentModel.DataAnnotations;

namespace CryptoReactPortfolio.Models
{
    public class Asset
    {
        [Key]
        public string Symbol { get; set; }
        public string CoinMarketCapUrl { get; set; }
        public double TokensOwned { get; set; }
    }
}