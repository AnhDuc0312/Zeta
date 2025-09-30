-- Dữ liệu bảng users
-- Xuất lúc: 2025-09-29T03:46:03.404Z
-- Số bản ghi: 23

INSERT INTO users (id, name, email, password_hash, role, status, avatar, bio, location, website, join_date, last_active) VALUES
  ('08d3d264-47d3-4a1a-8891-6f6c64d6c09c', 'New User', 'newuser@example.com', '$2b$10$RMnirqwHS3tG.RqEv583Ke3G8kPMFuXpLZ5YyndQzDOz0J43I.fK2', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:17:38.702Z', NULL),
  ('272f7e27-3f32-4991-a040-dcdcdf81390c', 'User Test', 'usertest@example.com', '$2b$10$SfqMrQQr4oPWttQBoQVFUeiPT4T9rWcTE7f2eM.KIefTrbAWt4MOm', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:14:59.858Z', NULL),
  ('3fc746c7-b9ff-417c-8fab-48d035eb5205', 'Test User', 'testuser@example.com', '$2b$10$B6o3hyx9v3vMBta7OAqnueZGWMQbXg6PEC8suW.ag7VYScJGKVyZq', 'user', 'active', NULL, NULL, NULL, NULL, '2025-07-15T02:54:40.826Z', NULL),
  ('753516d9-47b0-4fa2-87be-20ea4558fb01', 'Fiona Dao', 'fiona@example.com', 'hashed_pw_6', 'user', 'active', '/avatars/fiona.png', 'Writer.', 'Hai Phong', 'https://fiona.vn', '2023-06-30T05:00:00.000Z', '2024-06-04T07:00:00.000Z'),
  ('7c0c8341-fc41-40cc-972b-287cd94e6326', 'New Test User', 'newtest@example.com', '$2b$10$zuhzFfNqNKbj3ktfVKZcne6f.rry2HVgW0YEWV.hXxfyTKVHWRaky', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T08:58:04.151Z', NULL),
  ('80916923-b263-46ea-87f7-5efe97ca05bd', 'Test User', 'test2@example.com', '$2b$10$4PFtJ8f32udBdkRntJj9W.MvjsHJUSLEdFIo8yi.aUCfxBUzOPg9G', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:15:03.302Z', NULL),
  ('8de4af56-e9a2-4853-8ee0-5a3c0e67a64f', 'Category Test User', 'categorytest@example.com', '$2b$10$eTl5RfQjstO5Mx./SvRdq.G0JOr4FrjcJnLq4D8Au5D5HTRVIxknG', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:15:01.863Z', NULL),
  ('9ff50c11-9f85-46f3-8be1-a37e3b2bc4ca', 'Le Anh Duc', 'test@gmail.com', '$2b$10$7H.9x4T9mq122tSz1HIgtOMn6kyWLskPrKq2AiU1ocBVHDDSX24pi', 'user', 'active', NULL, '122', '122', '122', '2025-09-26T03:24:15.241Z', NULL),
  ('ac2852d2-5557-4f95-8e56-7f69377d5bf8', 'Test User', 'test@example.com', '$2b$10$s0FxV57TYb0NGq2J6pybJOd0TyuiJyr.hV3S32fh1djJ5.2PMIgp2', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T03:44:30.813Z', NULL),
  ('b1cf21ea-a179-4aa4-a4cc-b5bbfe699ced', 'Julia Phan', 'julia@example.com', 'hashed_pw_10', 'user', 'active', '/avatars/julia.png', 'Support.', 'Da Lat', 'https://julia.com', '2023-10-20T01:00:00.000Z', '2024-06-08T03:00:00.000Z'),
  ('c017870a-8d7d-4a57-972b-8cfe35d75761', 'Hannah Ly', 'hannah@example.com', 'hashed_pw_8', 'user', 'active', '/avatars/hannah.png', 'Designer.', 'Nha Trang', 'https://hannah.vn', '2023-08-10T03:00:00.000Z', '2024-06-06T05:00:00.000Z'),
  ('c20fbee3-54e4-4285-a18c-9459bbdbfdcd', 'Test User', 'invalid-email', '$2b$10$Whjndw8iKUyzBYogMv9pI.1N1tgkAAIIg9B3eEGklNi7n6ZIiL6Cu', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:15:03.214Z', NULL),
  ('c2ca3ea7-0513-4962-a6ff-89649d631fb9', 'anhduc', 'duc.la0312@gmail.com', '$2b$10$NpMhopejvMOzZQZMYwZPHuJZbseM4As6LwubTvigtVXe.uBcoRGL.', 'admin', 'active', NULL, NULL, NULL, NULL, '2025-07-18T00:02:09.844Z', NULL),
  ('d056c78f-340e-4ab0-9710-559bd2dd620d', 'AAA', 'duc.la@gmail.com', '$2b$10$8.dfeVfuCC3L5QVhTmaP3eyocc0Gwy35upoA6ZjP6XzQbJ8zaNG2S', 'user', 'active', NULL, NULL, NULL, NULL, '2025-07-16T07:28:59.921Z', NULL),
  ('d2e185cf-cf86-48e2-b793-b279cfd139d7', 'User2', 'user2@example.com', '$2b$10$tIwDYV.WPnBv8aPitaY8G.VsJHHVHw9cigF/9RGOlsFcZfiAjb6T.', 'user', 'active', NULL, NULL, NULL, NULL, '2025-07-16T06:46:13.657Z', NULL),
  ('d4a4e7c9-2be0-4516-bfe7-bf86b1e5e1ab', 'Content Test User', 'contenttest@example.com', '$2b$10$3AF8G2.3dV8i/VSfG1C.8uaiJ0R0wPkEPONYZSKV/6b/1wDpQDP6G', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T10:15:01.503Z', NULL),
  ('d55abd56-bff8-438d-86c7-05fd5dafd793', 'Charlie Le', 'charlie@example.com', 'hashed_pw_3', 'admin', 'active', '/avatars/charlie.png', 'Content creator.', 'Da Nang', 'https://charlie.vn', '2023-03-15T08:00:00.000Z', '2024-06-03T10:00:00.000Z'),
  ('d625672c-69b8-46d3-a40d-fdcec9592bae', 'Test User', 'testlogin@example.com', '$2b$10$YWhdJxJ4PEDs6ARQmaOi0edB26rvTAgpFScb/k0AH5Ii0BegWRfFm', 'user', 'active', NULL, NULL, NULL, NULL, '2025-07-16T06:42:03.591Z', NULL),
  ('d87744bd-4db1-463d-b934-1e7618ecbf54', 'Eddie Vo', 'eddie@example.com', 'hashed_pw_5', 'user', 'banned', '/avatars/eddie.png', 'Banned user.', 'Can Tho', 'https://eddie.io', '2023-05-25T06:00:00.000Z', '2023-11-01T08:00:00.000Z'),
  ('e4baf57c-4ace-4572-a821-3e17d6a35ee3', 'Admin User', 'admin@example.com', '$2b$10$uEwRHMM/2v0ermM5So3AQuay0OwMPR929jZM2rzbhCibvf8d5oDdK', 'user', 'active', NULL, NULL, NULL, NULL, '2025-09-26T03:46:11.165Z', NULL),
  ('e7bb5aab-1217-4e4c-8256-365f25e2d94b', 'George Bui', 'george@example.com', 'hashed_pw_7', 'user', 'active', '/avatars/george.png', 'Editor.', 'Vung Tau', 'https://george.com', '2023-07-05T04:00:00.000Z', '2024-06-05T06:00:00.000Z'),
  ('f2f22599-3609-4b4d-90eb-ed67bc9e61c7', 'User Updated', 'alice@example.com', 'hashed_pw_1', 'admin', 'active', '/avatars/alice.png', 'Admin user.', 'Hanoi', 'https://alice.dev', '2023-01-01T10:00:00.000Z', '2024-06-01T12:00:00.000Z'),
  ('f468dfe3-f47e-4478-bfc9-78dfa44d8252', 'Ivan Ho', 'ivan@example.com', 'hashed_pw_9', 'user', 'active', '/avatars/ivan.png', 'QA engineer.', 'Quy Nhon', 'https://ivan.io', '2023-09-15T02:00:00.000Z', '2024-06-07T04:00:00.000Z');

