package team.gif.gearscout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class Application {
	
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
					.allowedOriginPatterns("http://localhost:[*]", "https://*.gearitforward.com", "https://gearitforward.com")
					.allowedHeaders("*")
					.allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE")
					.exposedHeaders("*")
					.maxAge(60);
			}
		};
	}
	
}
