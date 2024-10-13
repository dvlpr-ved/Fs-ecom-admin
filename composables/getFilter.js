export default (args = []) => {
    const now = new Date();
    const first_date = new Date(now.getFullYear(), now.getMonth(), 1); 
    
    // Format dates as YYYY-MM-DD
    const from_date = `${first_date.getFullYear()}-${(first_date.getMonth() + 1).toString().padStart(2, '0')}-${first_date.getDate().toString().padStart(2, '0')}`;
    const to_date = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    let filters =  {
        from_date: from_date,
        to_date: to_date, 
    };
    
    if (args.indexOf('product') > -1) {
        filters = { ...filters, product_id: '' };
    }
    if (args.indexOf('user') > -1) {
        filters = { ...filters, user_id: '' };
    }
    if (args.indexOf('category') > -1) {
        filters = { ...filters, category_id: '' };
    }
    if (args.indexOf('plan') > -1) {
        filters = { ...filters, plan_id: '' };
    }

    return filters;
}
