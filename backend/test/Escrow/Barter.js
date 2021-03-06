// ================================
// Title : Unit Testing Barter
// Author: Vermont Phil Paguiligan
// Contributor:
// ================================

const assert     	= require("chai").assert;
const ItemClass     = require('../../classes/ItemClass');
const MDB_USER 		= require('../../models/MDB_USER');
const MDB_ITEMS 	= require('../../models/MDB_ITEMS');

let item_details;
let buyer_data;
let mdb_user = new MDB_USER();
let mdb_items = new MDB_ITEMS();

beforeEach(async () => 
{
	let user_info = await mdb_user.doc('5f7ad6515fbf0018b82be1c2');
	item_details =
	{
		item_id: "5fe2b8fe68021e02f662efb4",
        seller_id: "5fd9cd5246820d0ed4a2c781",
        buyer: user_info,
        duration: 3
    };
    
    let date_now = Date.now();
    buyer_data =
    {
        status                      : 'available',
        updated_timestamp           : date_now,
        updated_at                  : date_now,
        $unset                      : 
        {
            escrow_duration_date    : "",
            buyer_id                : "",
            buyer_first_name        : "",
            buyer_last_name         : "",
            escrowed_price          : "",
            escrowed_date           : ""
        }
    }
});

describe('Barter', async () => 
{
	it('Should return a success status', async () => 
	{
        await mdb_items.update("5fe2b8fe68021e02f662efb4", buyer_data);
		let item_class = new ItemClass(item_details);
        let res = await item_class.barter();
		let status = "success";
		assert.equal(res.status, status);
    });

    it('Should return an error for unavailable', async () => 
	{
		let item_class = new ItemClass(item_details);
        let res = await item_class.barter();
		let err_msg = "The product is not available at the moment.";
		assert.equal(res.message, err_msg);
    });
    
    it('Should show an error for own product barter', async () => 
	{
        item_details.buyer = await mdb_user.doc('5fd9cd5246820d0ed4a2c781');
		let item_class = new ItemClass(item_details);
        let res = await item_class.barter();
		let err_msg = "You cannot barter your own product.";
		assert.equal(res.message, err_msg);
    });

    it('Should show an error for insufficient balance', async () => 
	{
        await mdb_items.update("5fe2b8fe68021e02f662efb4", buyer_data);
        item_details.buyer = await mdb_user.doc('5ff302fa6544f537903fb2e6');
		let item_class = new ItemClass(item_details);
        let res = await item_class.barter();
		let err_msg = "Insufficient Balance";
		assert.equal(res.message, err_msg);
    });
});

