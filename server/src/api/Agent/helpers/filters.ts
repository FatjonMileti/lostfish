const getWeekNumber = (d: any) => {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo: any = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return [d.getUTCFullYear(), weekNo];
};

export const getFilters = (req: any) => {
  const search = req.query.search as string;
  const filters = req.query.type as string;
  const action = req.query.action;
  // Get the current date
  const currentDate = new Date();

  const afterLookupConditions: any = {};
  const query: {
    $or?: { [key: string]: RegExp }[];
    date?: any;
    action?: any;
    $where?: any;
  } = {};

  if (search) {
    query.$or = [
      { 'user.first_name': new RegExp(<string>search, 'i') },
      { 'user.last_name': new RegExp(<string>search, 'i') }
    ];
  }

  if (action) {
    query.action = { $eq: action };
  }

  if (filters === 'lastmonth') {
    // Calculate the date for the start of the last month
    const startOfLastMonth = new Date(currentDate);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);

    // Calculate the date for the start of the current month
    const startOfCurrentMonth = new Date(currentDate);
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);

    query.date = {
      $gte: startOfLastMonth,
      $lt: startOfCurrentMonth
    };
  }

  if (filters === 'lastweek') {
    // Calculate the date for the start of the current week (last Monday)
    const startOfLastWeek = new Date(currentDate);
    const dayOfWeek = startOfLastWeek.getDay();
    const diff = startOfLastWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // last Monday
    startOfLastWeek.setDate(diff);
    startOfLastWeek.setHours(0, 0, 0, 0);

    // Calculate the date for the start of this week (next Monday)
    const startOfThisWeek = new Date(startOfLastWeek);
    startOfThisWeek.setDate(startOfThisWeek.getDate() + 7);

    query.date = {
      $gte: startOfLastWeek,
      $lt: startOfThisWeek
    };
  }

  if (filters === 'today') {
    // Calculate the start and end of today
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(currentDate);
    endOfToday.setHours(23, 59, 59, 999);

    query.date = {
      $gte: startOfToday,
      $lt: endOfToday
    };
  }

  return {
    query,
    afterLookupConditions
  };
};
