import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useState, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";

export default function Perfil() {
  const { usuario } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [skinColor, setSkinColor] = useState<string>("#ffcc99");
  const [hairColor, setHairColor] = useState<string>("#4a3b2a");
  const [shirtColor, setShirtColor] = useState<string>("#2A9D8F");

  // 3D Avatar Component
  const Avatar3D = () => {
    return (
      <group position={[0, -1, 0]}>
        {/* Body/Shirt */}
        <mesh position={[0, 0.8, 0]} scale={[1.1, 1, 0.8]}>
            <capsuleGeometry args={[0.7, 1.2, 4, 8]} />
            <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.5]} />
            <meshStandardMaterial color={skinColor} />
        </mesh>

        {/* Head Group */}
        <group position={[0, 2.3, 0]}>
            {/* Head Shape */}
            <mesh>
                <sphereGeometry args={[0.65, 32, 32]} />
                <meshStandardMaterial color={skinColor} roughness={0.5} />
            </mesh>

            {/* Eyes */}
            <group position={[0, 0.1, 0.55]}>
                <mesh position={[-0.2, 0, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[-0.2, 0, 0.06]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial color="black" />
                </mesh>
                
                <mesh position={[0.2, 0, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="white" />
                </mesh>
                <mesh position={[0.2, 0, 0.06]}>
                    <sphereGeometry args={[0.04, 16, 16]} />
                    <meshStandardMaterial color="black" />
                </mesh>
            </group>

            {/* Eyebrows */}
            <group position={[0, 0.25, 0.58]}>
                 <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.1]}>
                    <boxGeometry args={[0.15, 0.03, 0.02]} />
                    <meshStandardMaterial color={hairColor} />
                 </mesh>
                 <mesh position={[0.2, 0, 0]} rotation={[0, 0, -0.1]}>
                    <boxGeometry args={[0.15, 0.03, 0.02]} />
                    <meshStandardMaterial color={hairColor} />
                 </mesh>
            </group>

            {/* Mouth (Smile) */}
            <mesh position={[0, -0.2, 0.58]} rotation={[0, 0, 0]}>
                <torusGeometry args={[0.1, 0.02, 16, 32, 3.14]} />
                <meshStandardMaterial color="#d68c7a" />
            </mesh>
            {/* Rotate mouth to smile */}
            <group position={[0, -0.2, 0.58]} rotation={[0, 0, 3.14]}>
                 {/* This is a trick, actually torus is better rotated directly. 
                     Let's just use a simple box for now or torus segment. 
                     Torus args: radius, tube, radialSegments, tubularSegments, arc */}
            </group>

            {/* Hair (Simplified "Helmet" + Volume) */}
            <group>
                {/* Main Hair Base */}
                <mesh position={[0, 0.1, -0.1]} scale={[1.05, 1.05, 1.05]}>
                    <sphereGeometry args={[0.65, 32, 32, 0, 6.28, 0, 1.8]} />
                    <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {/* Top Volume (Spheres) */}
                <mesh position={[0, 0.6, 0]} scale={[1, 0.6, 1]}>
                    <sphereGeometry args={[0.4, 16, 16]} />
                    <meshStandardMaterial color={hairColor} />
                </mesh>
                <mesh position={[-0.3, 0.5, 0.2]} scale={[0.8, 0.8, 0.8]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={hairColor} />
                </mesh>
                <mesh position={[0.3, 0.5, 0.2]} scale={[0.8, 0.8, 0.8]}>
                    <sphereGeometry args={[0.3, 16, 16]} />
                    <meshStandardMaterial color={hairColor} />
                </mesh>
            </group>
        </group>
      </group>
    );
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Mi Perfil
      </Typography>
      <Typography color="text.secondary" mb={3}>
        Gestiona tu cuenta y personaliza tu experiencia
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Datos Personales" />
          <Tab label="Personalización (Skin)" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{ width: 100, height: 100, margin: "0 auto", mb: 2, bgcolor: "primary.main", fontSize: 40 }}
                >
                  {usuario?.nombre?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight={700}>
                  {usuario?.nombre}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {usuario?.email}
                </Typography>
                <Button variant="outlined" startIcon={<EditIcon />} sx={{ mt: 2 }}>
                  Cambiar Avatar
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Información de la Cuenta
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Nombre Completo" fullWidth defaultValue={usuario?.nombre} />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Email" fullWidth defaultValue={usuario?.email} disabled />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField label="Biografía" fullWidth multiline rows={3} placeholder="Cuéntanos sobre ti..." />
                  </Grid>
                </Grid>
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button variant="contained" startIcon={<SaveIcon />}>
                    Guardar Cambios
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined" sx={{ height: "100%", minHeight: 400, bgcolor: "#f0f2f5", overflow: "hidden" }}>
                <Box sx={{ width: "100%", height: "100%", minHeight: 400 }}>
                    <Canvas camera={{ position: [0, 1.5, 8], fov: 40 }}>
                        <Suspense fallback={null}>
                            <ambientLight intensity={0.7} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} />
                            
                            <Avatar3D />
                            
                            <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#000000" />
                            <OrbitControls 
                                enablePan={false} 
                                enableZoom={false} 
                                target={[0, 1, 0]}
                                minPolarAngle={Math.PI / 3} 
                                maxPolarAngle={Math.PI / 1.8} 
                            />
                            <Environment preset="city" />
                        </Suspense>
                    </Canvas>
                </Box>
                <Typography textAlign="center" color="text.secondary" sx={{ position: "relative", bottom: 40, pointerEvents: "none" }}>
                  Arrastra para rotar en 3D
                </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Personaliza tu Avatar
                </Typography>
                
                <Box mb={3}>
                  <Typography gutterBottom>Color de Piel</Typography>
                  <Box display="flex" gap={1}>
                    {["#ffcc99", "#e0ac69", "#8d5524", "#c68642", "#f1c27d"].map(c => (
                        <Box 
                            key={c} 
                            onClick={() => setSkinColor(c)}
                            sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: c, 
                                borderRadius: "50%", 
                                cursor: "pointer",
                                border: skinColor === c ? "2px solid black" : "none",
                                boxShadow: 1
                            }} 
                        />
                    ))}
                  </Box>
                </Box>

                <Box mb={3}>
                  <Typography gutterBottom>Color de Pelo</Typography>
                  <Box display="flex" gap={1}>
                    {["#4a3b2a", "#000000", "#e6be8a", "#a52a2a", "#808080"].map(c => (
                        <Box 
                            key={c} 
                            onClick={() => setHairColor(c)}
                            sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: c, 
                                borderRadius: "50%", 
                                cursor: "pointer",
                                border: hairColor === c ? "2px solid black" : "none",
                                boxShadow: 1
                            }} 
                        />
                    ))}
                  </Box>
                </Box>

                <Box mb={3}>
                  <Typography gutterBottom>Color de Ropa</Typography>
                  <Box display="flex" gap={1}>
                    {["#2A9D8F", "#E76F51", "#264653", "#E9C46A", "#F4A261"].map(c => (
                        <Box 
                            key={c} 
                            onClick={() => setShirtColor(c)}
                            sx={{ 
                                width: 32, 
                                height: 32, 
                                bgcolor: c, 
                                borderRadius: "50%", 
                                cursor: "pointer",
                                border: shirtColor === c ? "2px solid black" : "none",
                                boxShadow: 1
                            }} 
                        />
                    ))}
                  </Box>
                </Box>

                <Button variant="contained" fullWidth startIcon={<SaveIcon />}>
                    Guardar Apariencia
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
