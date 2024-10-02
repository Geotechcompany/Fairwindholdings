var UserCookiesManager = (function (options) {
    var acceptedCookieKey = "_cookies_usage_"
    var eventsCategory = "UserCookies"
    
    return {
        persistSelection: function (essentialCookie, performanceCookie, targetingCookie) {
            var acceptedCookies = [];
            if (essentialCookie) acceptedCookies.push(options.essentialCookieName);
            if (performanceCookie) acceptedCookies.push(options.performanceCookieName);
            if (targetingCookie) acceptedCookies.push(options.targetingCookieName);
            CookieWrapper.write(options.cookieKeyName, acceptedCookies.join());
        },

        isAcceptedCookies: function () {
            return KeyValueStore.getBool(acceptedCookieKey, false) === true;
        },
        
        isAcceptedPerformance: function() {
            var current =  CookieWrapper.read(options.cookieKeyName)
            return current !== undefined && current.indexOf(options.performanceCookieName) > -1;
        },

        isAcceptedTargeting: function() {
            var current =  CookieWrapper.read(options.cookieKeyName)
            return current !== undefined && current.indexOf(options.targetingCookieName) > -1;
        },


        persistCookiesAcceptance: function(){
            KeyValueStore.setBool(acceptedCookieKey, true)
        },
        
        onCookiesAccept: function(label) {
            this.persistSelection(true, true, true);
            this.persistCookiesAcceptance()

            this.fireTracking()
            sendAnalyticsEvent(eventsCategory, "accept", label)
            sendAnalyticsEvent(eventsCategory,"select-automatically", options.targetingCookieName);
            sendAnalyticsEvent(eventsCategory, "select-automatically", options.performanceCookieName);
        },
        
        onCookiesModalAccept: function(isAcceptedTargeting, isAcceptedPerformance){
            KeyValueStore.setBool("Disable3rdPartyAnalytics", !isAcceptedPerformance)
            disableGoogleAnalytics(!isAcceptedPerformance);
            var alreadyAcceptedPerformance = this.isAcceptedCookies() && this.isAcceptedPerformance();
            this.persistSelection(true, isAcceptedPerformance, isAcceptedTargeting);
            this.persistCookiesAcceptance()
            
            if (isAcceptedTargeting){
                this.fireTracking()
                sendAnalyticsEvent(eventsCategory, "select-manually", options.targetingCookieName);
            }
            
            if (isAcceptedPerformance){
                sendAnalyticsEvent(eventsCategory, "select-manually", options.performanceCookieName);
            } else if (!alreadyAcceptedPerformance){
                sendAnalyticsEvent(eventsCategory, "unselect-manually",  options.performanceCookieName);
            }
        },
        
        fireTracking: function(){
            //This will fire a tag that triggers other tags on GTM - Dont Delete! 
            sendAnalyticsEvent('MarketingCookiesConsent', 'Accept');
            sendAnalyticsEvent('MarketingCookiesConsent', 'Fire');
        }
    }
})({essentialCookieName: "essential", targetingCookieName: "targeting", performanceCookieName: "performance", cookieKeyName: "cak"});