function get11DaysLater(dateString) {
    const initialDate = new Date(dateString);
    const halfHourLaterTime = initialDate.getTime() + (11 * 24 * 60 * 60 * 1000); 
    const halfHourLaterDate = new Date(halfHourLaterTime);
    return halfHourLaterDate.toISOString();
}

module.exports = get11DaysLater;