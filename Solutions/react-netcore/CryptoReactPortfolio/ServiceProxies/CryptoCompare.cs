using System;
using System.Collections.Generic;
using RestSharp;

namespace CryptoReactPortfolio.ServiceProxies
{
    public class CryptoCompare
    {
        public static readonly string baseUrl = "https://min-api.cryptocompare.com";

        public static PriceMultiFull.RootObject ExecutePriceMultiFull(List<string> coinSymbols)
        {
            string apiPath = "data/pricemultifull";
            var client = new RestClient(baseUrl);
            var request = new RestRequest(apiPath, Method.GET);
            request.AddQueryParameter("fsyms", string.Join(",", coinSymbols));
            request.AddQueryParameter("tsyms", "USD,BTC");
            request.AddQueryParameter("e", "CCCAGG");

            IRestResponse<PriceMultiFull.RootObject> response = client.Execute<PriceMultiFull.RootObject>(request);
            if(response.IsSuccessful)
            {
                return response.Data;
            }
            else
            {
                throw new Exception($"Error thrown from {baseUrl}/{apiPath}{Environment.NewLine}{response.ErrorMessage}");
            }
        }

        public static (HistoPrices.RootObject hourlyPrices, HistoPrices.RootObject minutePrices) ExecuteHistoPrices(string coinSymbol)
        {
            HistoPrices.RootObject hourlyPrices = ExecuteHistoHour(coinSymbol);
            HistoPrices.RootObject minutePrices = ExecuteHistoMinute(coinSymbol);

            return (hourlyPrices: hourlyPrices, minutePrices: minutePrices);
        }

        private static HistoPrices.RootObject ExecuteHistoHour(string coinSymbol)
        {
            string apiPath = "data/histohour";

            var client = new RestClient(baseUrl);
            var request = new RestRequest(apiPath, Method.GET);
            request.AddQueryParameter("fsym", coinSymbol);
            request.AddQueryParameter("tsym", "USD");
            request.AddQueryParameter("limit", "720");
            request.AddQueryParameter("aggregate", "1");

            IRestResponse<HistoPrices.RootObject> response = client.Execute<HistoPrices.RootObject>(request);
            if(response.IsSuccessful)
            {
                return response.Data;
            }
            else
            {
                throw new Exception($"Error thrown from {baseUrl}/{apiPath}{Environment.NewLine}{response.ErrorMessage}");
            }
        }

        private static HistoPrices.RootObject ExecuteHistoMinute(string coinSymbol)
        {
            string apiPath = "data/histominute";
            var client = new RestClient(baseUrl);
            var request = new RestRequest(apiPath, Method.GET);
            request.AddQueryParameter("fsym", coinSymbol);
            request.AddQueryParameter("tsym", "USD");
            request.AddQueryParameter("limit", "1440");
            request.AddQueryParameter("aggregate", "1");

            IRestResponse<HistoPrices.RootObject> response = client.Execute<HistoPrices.RootObject>(request);
            if(response.IsSuccessful)
            {
                return response.Data;
            }
            else
            {
                throw new Exception($"Error thrown from {baseUrl}/{apiPath}{Environment.NewLine}{response.ErrorMessage}");
            }
        }

        #region Models
        public class PriceMultiFull
        {
            public class USD
            {
                public double PRICE { get; set; }
                public double MKTCAP { get; set; }
            }

            public class BTC
            {
                public double PRICE { get; set; }
                public double MKTCAP { get; set; }
            }

            public class Detail
            {
                public USD USD { get; set; }
                public BTC BTC { get; set; }
            }

            public class RootObject
            {
                public Dictionary<string, Detail> RAW { get; set; }
            }
        }

        public class HistoPrices
        {
            public class HistoDatum
            {
                public int time { get; set; }
                public double close { get; set; }
                public double high { get; set; }
                public double low { get; set; }
                public double open { get; set; }
                public double volumefrom { get; set; }
                public double volumeto { get; set; }
            }

            public class ConversionType
            {
                public string type { get; set; }
                public string conversionSymbol { get; set; }
            }

            public class RootObject
            {
                public string Response { get; set; }
                public int Type { get; set; }
                public bool Aggregated { get; set; }
                public List<HistoDatum> Data { get; set; }
                public int TimeTo { get; set; }
                public int TimeFrom { get; set; }
                public bool FirstValueInArray { get; set; }
                public ConversionType ConversionType { get; set; }
            }
        }

        public class Trends
        {
            public string CoinSymbol { get; set; }
        }
        #endregion

    }
}