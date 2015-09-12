EasySearch._getComponentMethods = function (dict, index) {
  return {
    /**
     * Search a component for the given search string.
     *
     * @param {String} searchString String to search for
     */
    search: (searchString) => {
      check(searchString, String);

      dict.set('searching', searchString.length > 0);
      dict.set('searchOptions', {});
      dict.set('searchString', searchString);
    },
    /**
     * Return the EasySearch.Cursor for the current search.
     *
     * @returns {Cursor}
     */
    getCursor: () => {
      let searchString = dict.get('searchString') || '',
        options = dict.get('searchOptions');

      check(searchString, String);
      check(options, Match.Optional(Object));

      let cursor = index.search(searchString, options),
        searchOptions = index.getSearchOptions(options);

      dict.set('count', cursor.count());
      dict.set('searching', !cursor.isReady());
      dict.set('currentCount', cursor.mongoCursor.count());

      dict.set('limit', searchOptions.limit);
      dict.set('skip', searchOptions.skip);

      return cursor;
    },
    /**
     * Return true if the current search string is empty.
     *
     * @returns {boolean}
     */
    searchIsEmpty: () => {
      let searchString = dict.get('searchString');

      return !searchString || (_.isString(searchString) && 0 === searchString.trim().length);
    },
    /**
     * Return true if the component has no results.
     *
     * @returns {boolean}
     */
    hasNoResults: () => {
      let count = dict.get('count');

      return !_.isNumber(count) || 0 === count;
    },
    /**
     * Return true if the component is being searched.
     *
     * @returns {boolean}
     */
    isSearching: () => {
      return !!dict.get('searching');
    },
    /**
     * Return true if the component has more documents than displayed right now.
     *
     * @returns {boolean}
     */
    hasMoreDocuments: () => {
      return dict.get('currentCount') < dict.get('count');
    },
    /**
     * Load more documents for the component.
     *
     * @param {Number} count Count of docs
     */
    loadMore: (count) => {
      check(count, Number);

      let currentCount = dict.get('currentCount'),
        options = dict.get('searchOptions') || {};

      options.limit = currentCount + count;
      dict.set('searchOptions', options);
    },
    /**
     * Paginate through documents for the given page.
     *
     * @param {Number} page Page number
     */
    paginate: (page) => {
      check(page, Number);

      let options = dict.get('searchOptions') || {},
        limit = dict.get('limit');

      options.skip = limit * (page - 1);
      dict.set('searchOptions', options);
    }
  };
};
