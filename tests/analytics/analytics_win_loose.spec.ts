import { test } from "../login-fixture";
import { default_analytics_test } from "./default_analytics_test";


test('Победили / Проиграли', async ({ page }) => {
    await default_analytics_test(page);
});


