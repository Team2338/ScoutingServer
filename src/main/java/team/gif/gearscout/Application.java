package team.gif.gearscout;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
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

//	@Bean
//	public WebSecurityConfigurer configureWebSecurity() {
//		return new WebSecurityConfigurer() {
//			@Override
//			protected void configure(HttpSecurity http) throws Exception {
//				http.authorizeHttpRequests()
//					.anyRequest()
//					.permitAll()
//					.and()
//					.cors()
//					.and()
//					.csrf().disable();
//			}
//		}
//	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.authorizeHttpRequests((auth) -> auth.anyRequest().permitAll())
			.csrf(AbstractHttpConfigurer::disable);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(12);
	}

}
