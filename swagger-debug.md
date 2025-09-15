# Swagger Debug Steps

## 1. Test Endpoints Directly
- **API Docs JSON**: http://localhost:7980/v3/api-docs
- **Swagger UI**: http://localhost:7980/swagger-ui/index.html
- **Alternative UI**: http://localhost:7980/swagger-ui.html

## 2. Check Application Logs
Look for these errors in console:
- Bean creation failures
- OpenAPI scanning errors
- Controller mapping issues

## 3. Verify Dependencies
Run: `mvn dependency:tree | grep springdoc`

## 4. Test Simple Controller
If still failing, create a minimal test controller:

```java
@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @GetMapping("/hello")
    @Operation(summary = "Test endpoint")
    public String hello() {
        return "Hello Swagger!";
    }
}
```