/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2023
 */
package de.muenchen.dave.filter;

import de.muenchen.dave.exception.ParameterPollutionException;
import de.muenchen.dave.util.GatewayUtils;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * This {@link GlobalFilter} is used to detect and to fend off a parameter pollution attack.
 * <p>
 * Within a {@link HttpRequest} each request parameter should only exist once.
 * This check is necessary to avoid e.g. SQL injection split over multiple request parameters with
 * the same name.
 */
@Component
@Slf4j
public class GlobalRequestParameterPollutionFilter implements GlobalFilter, Ordered {

    @Override
    public int getOrder() {
        return GatewayUtils.ORDER_GLOBAL_FILTER;
    }

    /**
     * See {@link GlobalFilter#filter(ServerWebExchange, GatewayFilterChain)}
     *
     * @throws ParameterPollutionException is throw when a request parameter exists multiple times.
     *             The exception represents a http response with status {@link HttpStatus#BAD_REQUEST}.
     */
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) throws ParameterPollutionException {
        log.debug("Check for parameter pollution attack.");
        ServerHttpRequest request = exchange.getRequest();
        if (!CollectionUtils.isEmpty(request.getQueryParams())) {
            MultiValueMap<String, String> parameterMap = request.getQueryParams();
            for (Map.Entry<String, List<String>> entry : parameterMap.entrySet()) {
                String key = entry.getKey();
                List<String> value = entry.getValue();
                if (!CollectionUtils.isEmpty(value) && value.size() > 1) {
                    log.warn("Possible parameter pollution attack detected: Parameter \"{}\" detected more than once in the request!", key);
                    throw new ParameterPollutionException();
                }
            }
        }
        return chain.filter(exchange);
    }

}
