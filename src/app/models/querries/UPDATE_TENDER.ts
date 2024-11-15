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
                contract_number = $15,
                contract_date = $16,
                comment0 = $17,
                comment1 = $18,
                comment2 = $19,
                comment3 = $20,
                comment4 = $21,
                comment5 = $22
            WHERE id = $23
            `;
export default UPDATE_TENDER_QUERY