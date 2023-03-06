import XsrfTokenExtractor from "@/api/util/XsrfTokenExtractor";

export default class FetchUtils {

  /**
   * Liefert eine default GET-Config für fetch
   */
  static getGETConfig(): RequestInit {
    return {
      headers: this.getHeaders(),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: 'manual'
    };
  }

  /**
   * Liefert eine default POST-Config für fetch
   * @param body zu übertragender Body
   */
  static getPOSTConfig(body: any): RequestInit {
    return {
      method: 'POST',
      body: JSON.stringify(body),
      headers: FetchUtils.getHeaders(),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: "manual"
    }
  }

  /**
   * Liefert eine default PUT-Config für fetch
   * In dieser wird, wenn vorhanden, die Version der zu aktualisierenden Entität
   * als "If-Match"-Header mitgesetzt.
   * @param body zu übertragender Body
   */
  static getPUTConfig(body: any): RequestInit {
    return {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: this.getHeadersWithEtag(body),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: "manual"
    }
  }

  /**
   * Liefert eine default PATCH-Config für fetch
   * In dieser wird, wenn vorhanden, die Version der zu aktualisierenden Entität
   * als "If-Match"-Header mitgesetzt.
   * @param body zu übertragender Body
   */
  static getPATCHConfig(body: any): RequestInit {
    return {
      method: 'PATCH',
      body: JSON.stringify(body),
      headers: this.getHeadersWithEtag(body),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: "manual"
    }
  }

  /**
   * Liefert eine default DELETE-Config für fetch
   * @param body zur Ermittlung der Entity-Version für den Header "If-Match"
   * falls in Body gesetzt.
   */
  static getDELETEConfig(body: any): RequestInit {
    return {
      method: 'DELETE',
      headers: this.getHeadersWithEtag(body),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: "manual"
    }
  }

  /**
   *  Baut den Header fuer den Request auf
   * @returns {Headers}
   */
  static getHeaders(): Headers {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept-Language': 'de-DE',
      'X-XSRF-TOKEN': XsrfTokenExtractor.getXsrfToken().toString()
    });
    return headers;
  }

  /**
   * Baut den Header fuer den Request mit einem Etag auf.
   * @returns {Headers}
   */
  static getHeadersWithEtag(body: any): Headers {
    const headers = FetchUtils.getHeaders();
    if (body && body.entityVersion != null) {
      headers.append("If-Match", body.entityVersion)
    }
    return headers;
  }

  /**
   * Liefert die POST-Config für die generierung eines PDF
   */
  static getPdfPOSTConfig(body: any): RequestInit {
    return {
      method: 'POST',
      body: body,
      headers: FetchUtils.getPdfHeaders(),
      mode: 'cors',
      credentials: 'same-origin',
      redirect: "manual"
    }
  }

  /**
   * Baut den Header für ein PDF-Request auf
   */
  static getPdfHeaders(): Headers {
    let headers = new Headers({
      'Accept-Language': 'de-DE',
      'X-XSRF-TOKEN': XsrfTokenExtractor.getXsrfToken().toString()
    });
    return headers;
  }

}
