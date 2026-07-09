/**
 * Copyright (C) 2015 Loophole, LLC
 * <p>
 * Licensed under The Prosperity Public License 3.0.0
 */
package io.bastillion.manage.model;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserSessionsOutput {

    //instance id, host output
    Map<Integer, SessionOutput> sessionOutputMap = new ConcurrentHashMap<>();


    // Returns the live map on purpose: SessionOutputUtil routes terminal output by
    // mutating it (put/remove/clear). ConcurrentHashMap provides the thread safety; an
    // unmodifiable view here breaks all web-terminal output.
    public Map<Integer, SessionOutput> getSessionOutputMap() {
        return sessionOutputMap;
    }

    public void setSessionOutputMap(Map<Integer, SessionOutput> sessionOutputMap) {
        this.sessionOutputMap = new ConcurrentHashMap<>(sessionOutputMap);
    }
}



