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
        #endregion

    }
}