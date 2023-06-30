// shader.js

const vertexShader = `
	varying vec2 vUv;

	void main() {
		vUv = uv;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

const fragmentShader = `
	varying vec2 vUv;
	uniform float u_time;

	float julia(vec2 z, vec2 c) {
		for (float i = 0.0; i < 1e2; i++) {
			float xx = z.x * z.x, yy = z.y * z.y, zz = xx + yy;
			if (zz > 10.0) {
				return 100.0;
			}
			float re = c.x * z.x + c.y * z.y + xx * xx - yy * yy;
			float im = c.y * z.x - c.x * z.y + 2.0 * z.x * z.y * zz;
			z = vec2(re, im) / zz;
		}
		return 0.0;
	}

	void main() {
		float pi = 3.14159265359;
		float elevation = (vUv.y - 0.5) * pi;
		float azimuth = vUv.x * 2.0 * pi;
		float Z = sin(elevation);
		float cosel = cos(elevation);
		float X = cosel * cos(azimuth);
		float Y = cosel * sin(azimuth);
		vec2 coord = vec2(X / (1. - Z), Y / (1. - Z));

		coord = sqrt(0.1) * coord;
		vec2 c = vec2(-0.01, -0.1);
		float cycle = mod(u_time / 1000., 2. * pi);
		c = c + vec2(cos(cycle), sin(cycle)) * .01;
		float m = julia(coord, c);

		// Set the colors
		vec3 color2 = vec3(0.0, 0.0, 0.0); // Black color
		vec3 color1 = vec3(1.0, 0.0, 0.0); // Red color

		// Interpolate between black and red based on the fractal result
		vec3 rgb = mix(color1, color2, smoothstep(0.0, 100.0, m));

		gl_FragColor = vec4(rgb, 1.0);
	}
`;

export { vertexShader, fragmentShader };
