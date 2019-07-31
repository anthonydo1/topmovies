import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.UpdateValuesResponse;
import com.google.api.services.sheets.v4.model.ValueRange;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

public class GoogleSheetsIntegrationTest extends WebScraper{
    private static Sheets sheetsService;
    private static String SPREADSHEET_ID = "1kAOwMtCsUHy7eRs2ycghyL24imtVpKbl2Gl_CY6rKtw";

    public static void setup() throws GeneralSecurityException, IOException {
        sheetsService = SheetsServiceUtil.getSheetsService();
    }

    public void write() throws IOException {
        List<List<Object>> list = super.getList();
        ValueRange body = new ValueRange()
                .setValues(list);
        UpdateValuesResponse result = sheetsService.spreadsheets().values()
                .update(SPREADSHEET_ID, "A1", body)
                .setValueInputOption("RAW")
                .execute();
    }

    public static void main(String[] args) throws GeneralSecurityException, IOException{
        setup();
        GoogleSheetsIntegrationTest newTest = new GoogleSheetsIntegrationTest();
        newTest.write();
    }
}