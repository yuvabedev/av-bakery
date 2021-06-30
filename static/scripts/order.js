function createCustomerOrder(customerId) {
    console.log("Creating order for customerID : " + customerId);
    window.location.href = `/orderCreate?customerId=${customerId}`;
}