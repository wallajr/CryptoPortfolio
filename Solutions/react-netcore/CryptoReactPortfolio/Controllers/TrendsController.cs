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
    public class TrendsController : Controller
    {
        private readonly CryptoReactPortfolioContext _context;
        private List<Asset> Assets;
 
        public TrendsController(CryptoReactPortfolioContext context)
        {
            _context = context;
            Assets = _context.Assets.ToList();
        }

        [HttpGet]
        public Trends Get()
        {
            Trends trends = new Trends();
            foreach (var asset in Assets)
            {
                TrendsEntry trendsEntry = AddTrendsEntry(CryptoCompare.ExecuteHistoPrices(asset.Symbol));
                trendsEntry.Symbol = asset.Symbol;
                trendsEntry.CoinURL = asset.CoinMarketCapUrl;
                trends.Entries.Add(trendsEntry);
            }

            return trends;
        }

        #region Private Methods

        private TrendsEntry AddTrendsEntry((CryptoCompare.HistoPrices.RootObject hourlyPrices, CryptoCompare.HistoPrices.RootObject minutePrices) histoPrices)
        {
            TrendsEntry trends = new TrendsEntry
            {
                CurrentPrice = histoPrices.minutePrices.Data[1439].open,
                OneHour = histoPrices.minutePrices.Data[1379].open,
                SixHours = histoPrices.minutePrices.Data[1079].open,
                TwelveHours = histoPrices.minutePrices.Data[719].open,
                TwentyFourHours = histoPrices.minutePrices.Data[0].open,
                SevenDays = histoPrices.hourlyPrices.Data[551].open,
                ThirtyDays = histoPrices.hourlyPrices.Data[0].open
            };
            trends.OneHourPercentage = CalculatePercentage(trends.CurrentPrice, trends.OneHour);
            trends.SixHoursPercentage = CalculatePercentage(trends.CurrentPrice, trends.SixHours);
            trends.TwelveHoursPercentage = CalculatePercentage(trends.CurrentPrice, trends.TwelveHours);
            trends.TwentyFourHoursPercentage = CalculatePercentage(trends.CurrentPrice, trends.TwentyFourHours);
            trends.SevenDaysPercentage = CalculatePercentage(trends.CurrentPrice, trends.SevenDays);
            trends.ThirtyDaysPercentage = CalculatePercentage(trends.CurrentPrice, trends.ThirtyDays);

            return trends;
        }

        private double CalculatePercentage(double currentPrice, double previousPrice)
        {
            return Math.Round((((currentPrice/previousPrice)-1) * 100), 2);
        }

        #endregion

        #region Models
            
        public class Trends
        {
            public List<TrendsEntry> Entries { get; set; }
            public Trends()
            {
                Entries = new List<TrendsEntry>();
            }
        }

        public class TrendsEntry
        {
            public string Symbol { get; set; }
            public string CoinURL { get; set; }
            public double CurrentPrice { get; set; }
            public double OneHour { get; set; }
            public double SixHours { get; set; }
            public double TwelveHours { get; set; }
            public double TwentyFourHours { get; set; }
            public double SevenDays { get; set; }
            public double ThirtyDays { get; set; }
            public double OneHourPercentage { get; set; }
            public double SixHoursPercentage { get; set; }
            public double TwelveHoursPercentage { get; set; }
            public double TwentyFourHoursPercentage { get; set; }
            public double SevenDaysPercentage { get; set; }
            public double ThirtyDaysPercentage { get; set; }
        }

        #endregion
    }
}
