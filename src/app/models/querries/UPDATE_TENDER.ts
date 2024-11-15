const UPDATE_TENDER_QUERY = `
            UPDATE tenders 
            SET status = $1,
                company_id = $2,
                name = $3,
                lot_number = $4,
                register_number = $5,
                initial_max_price = $6,
                price = $7,
                contact_person = $8,
                phone_number = $9,
                email = $10,
                date1_start = $11,
                date1_finish = $12,
                date2_finish = $13,
                contract_number = $14,
                contract_date = $15,
                comment0 = $16,
                comment1 = $17,
                comment2 = $18,
                comment3 = $19,
                comment4 = $20,
                comment5 = $21
            WHERE id = $22
            `;
export default UPDATE_TENDER_QUERY