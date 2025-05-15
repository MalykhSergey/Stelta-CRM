import { test } from "../login-fixture";
import { default_analytics_test } from "./default_analytics_test";


test('По организациям', async ({ page }) => {
    await default_analytics_test(page);
});


