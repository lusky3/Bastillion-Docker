/**
 * Copyright (C) 2013 Loophole, LLC
 * <p>
 * Licensed under The Prosperity Public License 3.0.0
 */
package io.bastillion.manage.model;


import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class UserSchSessions {

    Map<Integer, SchSession> schSessionMap = new ConcurrentHashMap<>();


    // Returns the live map on purpose: SSHUtil, SecureShellKtrl, and SecureShellWS all
    // mutate it to track sessions. ConcurrentHashMap provides the thread safety; an
    // unmodifiable copy here breaks terminal creation (UnsupportedOperationException).
    public Map<Integer, SchSession> getSchSessionMap() {
        return schSessionMap;
    }

    public void setSchSessionMap(Map<Integer, SchSession> schSessionMap) {
        this.schSessionMap = (schSessionMap == null) ? new ConcurrentHashMap<>() : new ConcurrentHashMap<>(schSessionMap);
    }

}
