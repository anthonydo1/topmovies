import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class WebScraper {
    public List<List<Object>> getList() throws IOException{
        List<List<Object>> list = new ArrayList<>();

        final Document document = Jsoup.connect("https://www.boxofficemojo.com/alltime/world/").get();

        for (Element element : document.select("div#container div#main div#body table:nth-of-type(2) tbody tr td:nth-of-type(1) table")) {
            for (Element element3 : element.select("tbody tr")) {
                ArrayList<Object> listInner = new ArrayList<>();
                String rank = element3.select("td:nth-of-type(1)").text();
                String title = element3.select("td:nth-of-type(2)").text();
                String link = element3.select("td:nth-of-type(2) a").attr("href");
                String gross = element3.select("td:nth-of-type(4)").text();
                String studio = null;
                String releaseDate = null;
                String genre = null;
                String runtime = null;
                String rating = null;
                String budget = null;

                Document doc = Jsoup.connect("https://www.boxofficemojo.com" + link).get();
                String img = doc.select("#body table:nth-of-type(2) tbody tr td table:nth-of-type(1) tbody tr td:nth-of-type(1) a img").attr("abs:src");

                Elements movieElement = doc.select("#body table:nth-of-type(2) tbody tr td table:nth-of-type(1) tbody tr td:nth-of-type(2) table tbody tr td center table:nth-of-type(1) tbody");
                for (Element movieInfo : movieElement) {
                    studio = movieInfo.select("tr:nth-of-type(2) td:nth-of-type(1) b").text();
                    releaseDate = movieInfo.select("tr:nth-of-type(2) td:nth-of-type(2) b").text();
                    genre = movieInfo.select("tr:nth-of-type(3) td:nth-of-type(1) b").text();
                    runtime = movieInfo.select("tr:nth-of-type(3) td:nth-of-type(2) b").text();
                    rating = movieInfo.select("tr:nth-of-type(4) td:nth-of-type(1) b").text();
                    budget = movieInfo.select("tr:nth-of-type(4) td:nth-of-type(2) b").text();
                }
                listInner.add(rank);
                listInner.add(title);
                listInner.add(studio);
                listInner.add(gross);
                listInner.add(releaseDate);
                listInner.add(img);
                listInner.add(genre);
                listInner.add(runtime);
                listInner.add(rating);
                listInner.add(budget);
                list.add(listInner);
            }
        }
        return list;
    }
}
