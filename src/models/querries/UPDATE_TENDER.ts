const UPDATE_TENDER_QUERY = `
            UPDATE tenders 
            SET status = $1,
            is_special = $2,
                company_id = $3,
                name = $4,
                lot_number = $5,
                register_number = $6,
                initial_max_price = $7,
                price = $8,
                contact_person = $9,
                phone_number = $10,
                email = $11,
                date1_start = $12,
                date1_finish = $13,
                date2_finish = $14,
                date_finish = $15,
                contract_number = $16,
                contract_date = $17,
                comment0 = $18,
                comment1 = $19,
                comment2 = $20,
                comment3 = $21,
                comment4 = $22,
                comment5 = $23
            WHERE id = $24
            `;
export default UPDATE_TENDER_QUERY