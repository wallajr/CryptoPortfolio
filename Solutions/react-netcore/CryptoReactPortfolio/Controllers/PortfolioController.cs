using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RestSharp;
using CryptoReactPortfolio.Models;
using CryptoReactPortfolio.ServiceProxies;

namespace CryptoReactPortfolio.Controllers
{
    [Route("api/[controller]")]
    public class PortfolioController : Controller
    {
        private readonly CryptoReactPortfolioContext _context;
        private List<Asset> Assets;
 
        public PortfolioController(CryptoReactPortfolioContext context)
        {
            _context = context;
            Assets = _context.Assets.ToList();
        }

        [HttpGet]
        public Portfolio Get()
        {
            List<string> coinSymbols = Assets.Select(a => a.Symbol).ToList();

            Portfolio portfolio = ConvertToPortfolio(CryptoCompare.ExecutePriceMultiFull(coinSymbols));
            portfolio.Entries = portfolio.Entries.OrderByDescending(e => e.USDValue).ToList();

            return portfolio;
        }

        #region Private Methods

        private Portfolio ConvertToPortfolio(CryptoCompare.PriceMultiFull.RootObject currentPrices)
        {
            var portfolio = new Portfolio()
            {
                TotalInvestment = 1
            };

            foreach(KeyValuePair<string, CryptoCompare.PriceMultiFull.Detail> currentCoinPrice in currentPrices.RAW)
            {
                AddPortfolioEntryFromCurrentPrice(portfolio, currentCoinPrice);
            }

            return portfolio;
        }

        private void AddPortfolioEntryFromCurrentPrice(Portfolio portfolio, KeyValuePair<string,CryptoCompare.PriceMultiFull.Detail> currentCoinPrice)
        {
            var asset = Assets.First(a => string.Equals(a.Symbol, currentCoinPrice.Key, StringComparison.CurrentCultureIgnoreCase));
            var entry = new PortfolioEntry()
                {
                    Symbol = currentCoinPrice.Key,
                    CoinURL = asset.CoinMarketCapUrl,
                    TokensOwned = asset.TokensOwned,
                    BTCPerToken = currentCoinPrice.Value.BTC.PRICE,
                    USDPerToken = currentCoinPrice.Value.USD.PRICE,
                    MarketCap = currentCoinPrice.Value.USD.MKTCAP
                };

                portfolio.TotalUSDValue += entry.USDValue;
                portfolio.TotalBTCValue += entry.BTCValue;
                portfolio.Entries.Add(entry);
        }
        private string GetDelimitedCoinSymbols(string delimeter = ",")
        {
            return String.Join(delimeter, _context.Assets.Select(a => a.Symbol).ToList()).Replace(" ","");
        }

        #endregion

        #region Models
            
        public class Portfolio
        {
            public List<PortfolioEntry> Entries { get; set; }
            public double TotalUSDValue { get; set; }
            public double TotalBTCValue { get; set; }
            public double TotalInvestment { get; set; }
            public double ROI { get {return ((TotalUSDValue / TotalInvestment) - 1) * 100;} }
            public Portfolio()
            {
                Entries = new List<PortfolioEntry>();
            }
        }

        public class PortfolioEntry
        {
            public string Symbol { get; set; }
            public string CoinURL { get; set; }
            public double TokensOwned { get; set; }
            public double BTCPerToken { get; set; }
            public double USDPerToken { get; set; }
            public double USDValue { get {return TokensOwned * USDPerToken;} }
            public double BTCValue { get {return TokensOwned * BTCPerToken;} }
            public double MarketCap { get; set; }
        }

        #endregion
    }
}
